"use client"
import QueryEditor from '@/components/query-editor';

export default function Playground() {
  console.log("playground");

  let defaultValue = 
`-- Get the number of persons with each condition
select 
  co.condition_concept_id, 
  c.vocabulary_id, 
  c.concept_name, 
  count(*) as n_persons
from condition_occurrence co
inner join person p on p.person_id = co.person_id
inner join concept c on c.concept_id = co.condition_concept_id
group by co.condition_concept_id, c.vocabulary_id, c.concept_name
order by count(*) desc;
`
  defaultValue = 
`CREATE TEMP TABLE diagnosis
AS
SELECT
person_id
FROM
person;
ANALYZE diagnosis
;
`

  return (
  <>
    <QueryEditor defaultValue={defaultValue} />
  </>);
}

/*
CREATE TEMP TABLE diagnosis
AS
SELECT
person_id
FROM
person;
ANALYZE diagnosis
;

*/