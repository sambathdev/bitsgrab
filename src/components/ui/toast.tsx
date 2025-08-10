import { toast as sonnerToast } from "sonner";

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  buttonOk: {
    label: string;
    onClick: () => void;
  };
  buttonCancel: {
    label: string;
    onClick: () => void;
  };
}

const customToast = (toast: Omit<ToastProps, "id">) => {
  return sonnerToast.success("haha");
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      buttonOk={{
        label: toast.buttonOk.label,
        onClick: toast.buttonOk.onClick,
      }}
      buttonCancel={{
        label: toast.buttonCancel.label,
        onClick: toast.buttonCancel.onClick,
      }}
    />
  ));
};


function Toast(props: ToastProps) {
  const { title, description, buttonOk, buttonCancel, id } = props;

  return (
    <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            buttonOk.onClick();
          }}
        >
          {buttonOk.label}
        </button>
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            buttonCancel.onClick();
          }}
        >
          {buttonCancel.label}
        </button>
      </div>
    </div>
  );
}

export { customToast };
