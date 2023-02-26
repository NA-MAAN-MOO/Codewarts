export default function CloseButton(props: any) {
  const { handleBack } = props;

  return (
    <>
      <button onClick={handleBack}>돌아가기</button>
    </>
  );
}
