import { redirect } from 'next/navigation';

export default function Home() {
  // কেউ মেইন পেজে আসলে সরাসরি লগইন পেজে পাঠিয়ে দেব
  redirect('/login');
}