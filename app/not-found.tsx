export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">404 - ページが見つかりません</h1>
        <p className="text-lg mb-6">お探しのページは存在しないか、移動した可能性があります。</p>
        <a href="/" className="text-blue-500 hover:underline">
          ホームに戻る
        </a>
      </div>
    );
  }