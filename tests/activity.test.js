import test from 'node:test';
import assert from 'node:assert/strict';
import {parseContributions, contributionStats, summarizeLanguages, fetchActivity, createActivityLoader} from '../lib/activity.js';

test('contribution counts come from GitHub tooltips, not heatmap color levels', () => {
  const html = '<td data-date="2026-09-24" data-level="1" id="a"></td><tool-tip for="a">14 contributions on September 24th.</tool-tip><td id="b" data-date="2026-09-23" data-level="0"></td><tool-tip for="b">No contributions on September 23rd.</tool-tip>';
  assert.deepEqual(parseContributions(html), [{date:'2026-09-23', count:0, level:0}, {date:'2026-09-24', count:14, level:1}]);
  assert.throws(() => parseContributions('<td data-date="2026-09-24" data-level="3" id="missing-tip"></td>'));
  assert.throws(() => parseContributions(html + html));
});
test('streaks distinguish zero-activity days, yesterday grace period, and calendar gaps', () => {
  const days = [{date:'2026-09-20',count:2},{date:'2026-09-21',count:1},{date:'2026-09-22',count:0},{date:'2026-09-23',count:3},{date:'2026-09-24',count:0}];
  assert.deepEqual(contributionStats(days), {total:6,currentStreak:1,longestStreak:2});
  assert.deepEqual(contributionStats([{date:'2026-09-20',count:1},{date:'2026-09-24',count:2}]), {total:3,currentStreak:1,longestStreak:1});
  assert.deepEqual(contributionStats([]), {total:0,currentStreak:0,longestStreak:0});
});
test('language percentages aggregate byte counts across repositories', () => {
  const result=summarizeLanguages([{PHP:100,JavaScript:100},{JavaScript:200,Invalid:-5}]);
  assert.deepEqual(result.map(x=>[x.name,x.percent]), [['JavaScript',75],['PHP',25]]);
});
test('upstream failures retain dated snapshots and never expose authentication', async () => {
  const data=await fetchActivity({fetchImpl:async()=>({ok:false}),token:'secret-test-value'});
  assert.equal(data.stale,true); assert.equal(data.calendar.stale,true); assert.ok(data.calendar.days.length>300);
  assert.equal(JSON.stringify(data).includes('secret-test-value'),false);
});
test('concurrent activity loads share work and successful data lasts one hour',async()=>{
  let calls=0,time=0;
  const load=createActivityLoader(async()=>{calls++;return {stale:false};},()=>time);
  await Promise.all([load(),load(),load()]); assert.equal(calls,1);
  time=3599999;await load();assert.equal(calls,1);
  time=3600000;await load();assert.equal(calls,2);
});
