import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Eirene"
}

export default function Home({db, test}: any) {
  return (
    <>
      {/*<h1 className="font-extrabold text-4xl">Eirene</h1>*/}
      <p>Welcome to Eirene, an OMOP CDM playground based on the Eunomia Datasets!</p>
    </>
  )
}
