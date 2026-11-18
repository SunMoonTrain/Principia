import { checkListings } from './lib.ts';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('npm run listings -- [学科、领域或小节 id…]，省略范围时检查全部小节。');
} else {
  const { messages, ok } = checkListings(process.cwd(), args);
  console.log(messages.join('\n'));
  process.exitCode = ok ? 0 : 1;
}
