import {expect,it} from 'vitest';
import {gridFrames,type GridRun} from './grid-search';
import {mulberry32} from './rng';
const rows=`S....#....
.##..#.~~.
..#..#.~~.
..#....~~.
..####..#.
.......##G`.split('\n');
const make=(run:GridRun,moves:4|8=4,map=rows)=>[...gridFrames({rows:map,moves,costs:{'~':5},runs:[run]},run)];
it('示例地图逐扩展计数、路径与并列次序',()=>{
  const check=(run:GridRun,moves:4|8,count:number,cost:number)=>{
    const all=make(run,moves),f=all.at(-1)!;
    expect([all.length-1,f.expanded,f.cost]).toEqual([count,count,cost]);return f;
  };
  const bfs=check({algorithm:'bfs'},4,45,22);expect(bfs.path.length).toBe(15);
  expect(make({algorithm:'astar'}).slice(0,-1).every(f=>f.path.length===0)).toBe(true);
  check({algorithm:'dfs'},4,21,20);const d=check({algorithm:'dijkstra'},4,46,20);
  check({algorithm:'greedy'},4,15,22);const a=check({algorithm:'astar'},4,42,20);
  expect(a.path).toEqual([0,1,2,3,4,14,24,34,35,36,26,16,6,7,8,9,19,29,39,49,59]);expect(d.path).toEqual(a.path);
  expect(make({algorithm:'astar',heuristic:'zero'}).map(s=>s.at)).toEqual(make({algorithm:'dijkstra'}).map(s=>s.at));
  check({algorithm:'astar',weight:2},4,24,22);
  check({algorithm:'dijkstra'},8,45,16.49);check({algorithm:'astar'},8,41,16.49);
  check({algorithm:'astar',heuristic:'manhattan'},8,39,16.49);check({algorithm:'greedy'},8,11,18.14);check({algorithm:'bfs'},8,46,19.66);
});
it('40 × 25 大图与斜穿墙角规则',()=>{
  const r=mulberry32(11),map=Array.from({length:25},(_,y)=>Array.from({length:40},(_,x)=>x+y===0?'S':x+y===63?'G':r()<.28?'#':'.').join(''));
  for(const [algorithm,expanded] of [['astar',226],['dijkstra',680]] as const)expect(make({algorithm},4,map).at(-1)).toMatchObject({expanded,cost:69});
  expect(make({algorithm:'astar'},8,['S#','#G']).at(-1)?.found).toBe(false);
  expect(make({algorithm:'astar'},8,['S#','.G']).at(-1)?.cost).toBe(1.41);
});
// 以全边反复松弛求距离，参照不使用搜索器的邻居函数、队列或启发式。
function oracle(rows:string[],moves:number){
  const w=rows[0].length,a=rows.join(''),d=Array<number>(a.length).fill(Infinity);d[0]=0;
  for(let pass=0;pass<a.length;pass++){
    let changed=false;
    for(let i=0;i<a.length;i++)for(let j=0;j<a.length;j++){
      const dx=Math.abs(i%w-j%w),dy=Math.abs(Math.floor(i/w)-Math.floor(j/w));
      if(i===j||dx>1||dy>1||a[i]==='#'||a[j]==='#')continue;
      if(dx&&dy&&(moves===4||a[Math.floor(i/w)*w+j%w]==='#'&&a[Math.floor(j/w)*w+i%w]==='#'))continue;
      const cost=d[i]+(a[j]==='~'?5:1)*Math.hypot(dx,dy);
      if(cost<d[j]-1e-9){d[j]=cost;changed=true;}
    }
    if(!changed)break;
  }
  return Number.isFinite(d.at(-1)!)?Number(d.at(-1)!.toFixed(2)):-1;
}
it.each([1,31,63])('随机地形，可采纳 A* 与独立最短路一致 %i',seed=>{
  const r=mulberry32(seed);
  for(let i=0;i<15;i++){
    const map=Array.from({length:5},(_,y)=>Array.from({length:6},(_,x)=>!x&&!y?'S':x+y===9?'G':r()<.25?'#':r()<.35?'~':'.').join(''));
    for(const moves of [4,8] as const){
      const expected=oracle(map,moves);expect(make({algorithm:'dijkstra'},moves,map).at(-1)?.cost).toBe(expected);
      for(const heuristic of ['zero','octile','euclidean','chebyshev','manhattan'] as const){
        if(moves===8&&heuristic==='manhattan')continue;
        expect(make({algorithm:'astar',heuristic},moves,map).at(-1)?.cost).toBe(expected);
      }
    }
  }
});
