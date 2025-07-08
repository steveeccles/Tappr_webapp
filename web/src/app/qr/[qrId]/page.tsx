import { redirect, notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function QRRedirectPage({ params }: { params: { qrId: string } }) {
  const { qrId } = params;

  const cardRef = doc(db, 'qrCards', qrId);
  const snapshot = await getDoc(cardRef);

  if (!snapshot.exists()) {
    notFound();
  }

  const data = snapshot.data();
  
  // Check if card is activated and has redirect URL
  if (!data.isActivated || !data.redirectUrl) {
    notFound();
  }

  redirect(data.redirectUrl);
} 