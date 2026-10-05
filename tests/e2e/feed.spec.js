import {test,expect} from '@playwright/test';
for(const count of [20,50]) test(`feed de ${count} publicaciones sin N+1`,async({page})=>{
 let requests=0;
 const posts=Array.from({length:count},(_,i)=>({pid:String(i),title:'Historia '+i,description:'Historia ficticia',user:{username:'alias'},createdAt:'2026-01-01T00:00:00.000Z',visibility:'public',isMine:false,commentCount:0,reactionCount:{like:0,love:0,laugh:0,sad:0,angry:0,total:0},userReaction:null}));
 await page.route('**/BLFAGS/v1/**',async route=>{
  if(route.request().method()==='OPTIONS') return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*'}});
  requests++;
  expect(route.request().url()).toContain('/publication/getPublications');
  const cursor=Number(new URL(route.request().url()).searchParams.get('cursor')||0),rows=posts.slice(cursor,cursor+20),hasMore=cursor+20<count;
  await route.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({success:true,publications:rows,hasMore,nextCursor:hasMore?String(cursor+20):null})});
 });
 await page.goto('/publications');await expect(page.locator('.publication-card')).toHaveCount(20);await page.waitForLoadState('networkidle');expect(requests).toBe(1);
 if(count===50) {await page.getByRole('button',{name:'Cargar más'}).click();await expect(page.locator('.publication-card')).toHaveCount(40);await page.getByRole('button',{name:'Cargar más'}).click();await expect(page.locator('.publication-card')).toHaveCount(50);expect(requests).toBe(3);}
});
