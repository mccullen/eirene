//import { permanentRedirect } from 'next/navigation'
export default function Home({db, test}: any) {
  //permanentRedirect("/playground");
  return (
    <>
      {/*<h1 className="font-extrabold text-4xl">Eirene</h1>*/}
      <p>Welcome to the Eirene web app, an OMOP CDM playground based on the Eunomia Datasets!</p>
    </>
  )
}
