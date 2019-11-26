function MetaBadge({ isMeta }) {
  const ret = isMeta ? (
    <span
      className="rounded-full bg-teal-400 text-center text-lg font-bold text-white py-2 px-3"
      title="Meta-analysis or systematic review"
    >
      M
    </span>
  ) : (
    <span
      className="rounded-full bg-gray-400 text-center text-lg font-bold text-white py-2 px-3"
      title="Paper"
    >
      P
    </span>
  );
  return <div className="pr-3">{ret}</div>;
}

export default MetaBadge;
