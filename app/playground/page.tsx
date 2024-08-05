"use client"
//import QueryEditor from '@/components/query-editor';
import dynamic from 'next/dynamic';
const QueryEditor = dynamic(() => import('@/components/query-editor'), {ssr: false});

export default function Playground() {
  return (
  <>
    <QueryEditor />
  </>);
}