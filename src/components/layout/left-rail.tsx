import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import {
	ModalActions,
	Paths,
} from '@common/constants';
import {
	HomeActiveIcon,
	LoginIcon,
	FaqActiveIcon,
	FaqIcon,
	HomeIcon,
	GameActiveIcon,
	GameIcon,
} from '@components/icons';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';

interface Props {
	label: string;
	secondary?: string;
	children: ReactNode;
}

function RailButtonContent(props: Props) {
	const {
		label,
		secondary = '',
		children,
	} = props;
	return (
		<>
			<ListItemIcon>
				{children}
			</ListItemIcon>
			<ListItemText
				primary={label}
				secondary={secondary}
				sx={{
					display: {
						xs: 'none',
						md: 'inline',
					},
				}}
			/>
		</>
	);
}

// TODO Implement better path matching for active icon

function LeftRail() {
	const router = useRouter();
	const { data } = useSession();
	const {
		pathname,
		query,
	} = router;
	const user = data?.user;

	return (
		<>
			<List>
				<ListItem disablePadding>
					<Link
						shallow
						passHref
						href={Paths.Home}
					>
						<ListItemButton>
							<RailButtonContent label="Home">
								{
									Paths.Home === pathname ?
										<HomeActiveIcon /> :
										<HomeIcon />
								}
							</RailButtonContent>
						</ListItemButton>
					</Link>
				</ListItem>
				{!user && (
					<>

						<ListItem disablePadding>
							<Link
								shallow
								passHref
								href={Paths.Faq}
							>
								<ListItemButton>
									<RailButtonContent
										label="Uhh...Wut?"
									>
										{
											Paths.Faq === pathname ?
												<FaqActiveIcon /> :
												<FaqIcon />
										}
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
						<ListItem disablePadding>
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
								<ListItemButton>
									<RailButtonContent
										label="Login"
										secondary="or register"
									>
										<LoginIcon/>
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
					</>
				)}
				{!!user && (
					<>
						<ListItem disablePadding>
							<Link
								shallow
								passHref
								href={Paths.MyGames}
							>
								<ListItemButton>
									<RailButtonContent label="My Games">
										{
											Paths.MyGames === pathname ?
												<GameActiveIcon /> :
												<GameIcon />
										}
									</RailButtonContent>
								</ListItemButton>
							</Link>
						</ListItem>
					</>
				)}
			</List>
		</>
	);
}

export { LeftRail };
