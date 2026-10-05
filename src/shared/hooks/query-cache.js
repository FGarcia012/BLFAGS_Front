export const publicationId = row => row.pid || row._id;
export function patchPublication(client,pid,change) {
 const update = row => String(publicationId(row)) === String(pid) ? {...row,...(typeof change === 'function' ? change(row):change)}:row;
 for (const key of ['publications','userPublications','hashtagPublications']) client.setQueriesData({queryKey:[key]},data => data ? {...data,pages:data.pages.map(page => ({...page,publications:page.publications.map(update),...(page.latest ? {latest:{...page.latest,publications:page.latest.publications.map(update)}}:{})}))}:data);
 client.setQueriesData({queryKey:['publication',pid]},data => data ? {...data,publication:update(data.publication)}:data);
}
export async function invalidatePublications(client) {
 // Reinicia cada lista activa a una página: una sola lectura después de la mutación.
 for (const key of ['publications','userPublications','hashtagPublications']) {
  client.setQueriesData({queryKey:[key]},data => data ? {...data,acceptIncoming:true,pages:data.pages.slice(0,1),pageParams:data.pageParams.slice(0,1)}:data);
  await client.invalidateQueries({queryKey:[key]});
 }
 await client.invalidateQueries({queryKey:['publication']});
}
