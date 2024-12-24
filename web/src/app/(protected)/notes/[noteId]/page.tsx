"use server";

type Params = Promise<{ noteId: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const slug = params.noteId;

    console.log(slug);

  return (
    <div>
      <h1>Notes</h1>
      <h2>{slug}</h2>
    </div>
  );
}
