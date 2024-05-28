import QueryEditor from '@/components/query-editor';
export default function Tutorial() {
    return (
    <>
        <h1 className="font-extrabold text-4xl">Tutorial</h1>
        <p>Get the number of patients</p>
        <QueryEditor 
            defaultValue={"-- Type query here"} 
            solution={
`SELECT COUNT(*)
FROM person;`
} />
        <hr />

        <p>Get the number of concepts</p>
        <QueryEditor defaultValue={"-- Type query here"}/>
    </>);
}