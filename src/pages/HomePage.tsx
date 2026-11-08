// 首页：先用一个简单列表列出所有小节和层级（星图是台阶 5、6 的事）。

import { Link } from 'react-router';
import { lessonPath } from '../../shared/ids';
import { StatusBadge } from '../components/StatusBadge';
import { useContent } from '../content/ContentContext';
import { Rich } from '../content/Rich';
import { useProgress } from '../progress/ProgressContext';
import { subjectTitle } from '../subjects';

export function HomePage() {
  const { graph, error } = useContent();
  const progress = useProgress();
  if (error && !graph) return <p className="page-message">读不到内容：{error}。先运行 npm run dev（会自动编译 content/）。</p>;
  if (!graph) return <p className="page-message">正在读取内容…</p>;

  const subjects = [...new Set(graph.domains.map((d) => d.subject))];
  return (
    <div className="home">
      <h1 className="home-title">所有小节</h1>
      <p className="home-lead">
        共 {graph.lessons.length} 节，按领域分组、按层级排列。层级是从没有前置的小节出发的最长前置链长度，越大越深。
      </p>
      {subjects.map((subject) => (
        <section key={subject} className="home-subject">
          <h2>{subjectTitle(subject)}</h2>
          {graph.domains
            .filter((d) => d.subject === subject)
            .map((domain) => {
              const lessons = graph.lessons.filter((l) => l.domain === domain.id);
              return (
                <div key={domain.id} className="home-domain">
                  <h3>
                    <Rich value={domain.title} />
                    <span className="home-domain-count">{lessons.length} 节</span>
                  </h3>
                  <ol className="lesson-list">
                    {lessons.map((lesson) => (
                      <li key={lesson.id} className={`lesson-row lesson-row-${lesson.status}`}>
                        <span className="lesson-level">层级 {lesson.level}</span>
                        <span className="lesson-row-main">
                          <Link to={lessonPath(lesson.id)} className="lesson-row-title">
                            <Rich value={lesson.title} />
                          </Link>
                          <span className="lesson-row-summary">
                            <Rich value={lesson.summary ?? lesson.goal} />
                          </span>
                        </span>
                        {progress.state.lessons[lesson.id]?.status === 'completed' && <span className="badge badge-done">已学完</span>}
                        <StatusBadge status={lesson.status} />
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
        </section>
      ))}
    </div>
  );
}
