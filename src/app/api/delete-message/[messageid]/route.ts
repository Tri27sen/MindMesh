
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbconnect';
import { User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import { ObjectId } from 'mongodb';
import UserModel from "@/model/user";
// The DELETE request handler
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ messageid: string }> }
) {
  // Awaiting the params to resolve the promise
  const { messageid } = await context.params;
  // Ensure messageid is a valid MongoDB ObjectId
  if (!ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { success: false, message: 'Invalid message ID' },
      { status: 400 }
    );
  }

  // Connect to the database
  await dbConnect();

  // Get user session
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  try {
    console.log(`Deleting message with ID: ${messageid} by user: ${_user.email}`);
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    return new Response(
      JSON.stringify({ success: true, message: 'Message deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting message' }),
      { status: 500 }
    );
  }
}