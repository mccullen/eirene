"use client"
import QueryEditor from '@/components/query-editor';

export default function Playground() {
  let defaultValue = 
`select * from person limit 100;`
  return (
  <>
    <QueryEditor defaultValue={defaultValue} />
  </>);
}