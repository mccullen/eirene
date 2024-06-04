"use client"
import QueryEditor from '@/components/query-editor';

export default function Playground() {
  console.log("playground");
  return (
  <>
    <h1 className="font-extrabold text-4xl p-2">Playground</h1>
    <QueryEditor />
  </>);
}