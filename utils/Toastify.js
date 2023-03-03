import { toast } from 'react-toastify';

export const toastDisplaySuccess = (msg) => {
	return toast.success(<div>{msg}</div>, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "light",
	});
}

export const toastDisplayError = (msg) => {
	toast.error(<div>{msg}</div>, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "light",
	});
}

export const toastDisplayInfo = (msg) => {
	toast.info(<div>{msg}</div>, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "light",
	});
}

export const toastDisplayPromise = (promise) => {
	toast.promise(promise, {
		pending: 'Promise is pending',
		success: 'Promise resolved 👌',
		error: 'Promise rejected 🤯'
	  })
}

export const toastDisplayPromiseSendMail = (promise) => {
	toast.promise(promise, {
		pending: "Préparation du mail",
		success: "Le mail à bien été envoyé 👌",
		error: "Le mail n'a pas pu être envoyé 🤯"
	  })
}