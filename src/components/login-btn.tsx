import { ModalActions } from '@common/constants';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export
function LoginBtn() {
	const { data: session } = useSession();
	const router = useRouter();
	const {
		pathname,
		query,
	} = router;

	if (session) {
		return (
			<>
				Signed in as {session.user.username}
				<Link
					shallow
					passHref
					href={{
						pathname,
						query: {
							a: ModalActions.Logout,
							...query,
						},
					}}
				>
					<Button>
						Logout
					</Button>
				</Link>
			</>
		);
	}
	return (
		<>
			<Link
				shallow
				passHref
				href={{
					pathname,
					query: {
						a: ModalActions.LoginRegister,
						...query,
					},
				}}
			>
				<Button>Login</Button>
			</Link>
		</>
	);
}
