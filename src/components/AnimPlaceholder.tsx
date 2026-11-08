// 还没实现的动画组件（附录里列了、packages/anim 里还没有）：显示占位框，构建同时给警告。

function pascalCase(name: string): string {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
}

export function AnimPlaceholder(props: { 'data-component'?: string }) {
  const name = props['data-component'] ?? '';
  return (
    <div className="anim-placeholder" role="img" aria-label={`动画组件 ${name}（尚未实现）`}>
      <div className="anim-placeholder-title">动画组件 {pascalCase(name)}</div>
      <div className="anim-placeholder-note">
        <code>{name}</code> 还没实现，先放一个占位框
      </div>
    </div>
  );
}
