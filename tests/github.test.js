import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanRepos, fetchPortfolio, createPortfolioLoader, OWNER } from '../lib/github.js';

test('only public owned projects are exposed and response fields are whitelisted', () => {
  const repos = cleanRepos([
    {name:'Allowed',owner:{login:OWNER},html_url:'javascript:alert(1)',private:false,secret:'never expose'},
    {name:'Private',private:true}, {name:'Fork',fork:true}, {name:'Archive',archived:true},
    {name:'SomeoneElse',owner:{login:'other'}}
  ]);
  assert.equal(repos.length, 1);
  assert.equal(repos[0].html_url, `https://github.com/${OWNER}/Allowed`);
  assert.equal('secret' in repos[0], false);
});

test('API failure retains a useful snapshot rather than erasing the portfolio', async () => {
  const result = await fetchPortfolio({fetchImpl: async () => ({ok:false,status:403}),token:'test-only'});
  assert.equal(result.stale, true);
  assert.ok(result.repos.some(repo => repo.name === 'Bening-Studio'));
  assert.equal(JSON.stringify(result).includes('test-only'), false);
});

test('a partial API failure keeps live repositories and marks data as partially cached', async () => {
  const result = await fetchPortfolio({fetchImpl:async url => url.includes('/users/') && url.includes('/repos?')
    ? {ok:true,json:async () => [{name:'New-Project',html_url:`https://github.com/${OWNER}/New-Project`}]}
    : {ok:false,status:503},token:''});
  assert.equal(result.repos[0].name, 'New-Project');
  assert.equal(result.stale, true);
});

test('concurrent requests share one fetch and failed data is refreshed sooner', async () => {
  let calls=0, time=0;
  const load=createPortfolioLoader(async () => { calls++; return {stale:true, repos:[]}; }, () => time);
  await Promise.all([load(),load(),load()]);
  assert.equal(calls,1);
  time=59_000; await load(); assert.equal(calls,1);
  time=61_000; await load(); assert.equal(calls,2);
});
