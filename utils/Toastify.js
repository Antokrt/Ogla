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
	toast.error(<div styles={{fontSize: "10px"}} >{msg}</div>, {
		position: "bottom-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: false,
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
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "light",
		icon:false
	});
}

export const toastDisplayTest = (msg) => {
	toast.info(<div>{msg}</div>, {
		position: "top-right",
		closeOnClick: true,
		autoClose:false,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "light",
		icon:false
	});
}


export const toastDisplayPromiseSendMail = (promise) => {
	toast.promise(promise, {
		pending: "Préparation du mail...",
		success: "Email envoyé !",
		error: "Impossible d'envoyer l'email !",
	},{
		pauseOnHover: false,
		draggable: false,
	})
}