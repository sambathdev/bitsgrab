import { useState } from "react";

interface InvokeInputProps {
  onSubmit: any;
  label?: string;
}

const InvokeInput = ({ onSubmit, label }: InvokeInputProps) => {
  const [data, setData] = useState("");
  return (
    <>
      <hr />
      <label htmlFor="">{label}</label>
      <div className="p-2 w-full flex items-center gap-2">
        <input type="text" className="border border-border rounded w-full" value={data} onChange={(e) => setData(e.target.value)} />
        <button onClick={() => onSubmit(data)}>Submit</button>
      </div>
      <hr />
    </>
  );
};

export default InvokeInput;
