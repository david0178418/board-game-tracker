import { LoginModal } from '@components/modals/login.modal';
import { LogoutModal } from '@components/modals/logout.modal';
import { Loader } from '@components/loader';
import { Toast } from '@components/toast';

export
function CommonStuff() {
	return (
		<>
			<LogoutModal />
			<LoginModal />
			<Toast />
			<Loader />
		</>
	);
}

export default CommonStuff;
