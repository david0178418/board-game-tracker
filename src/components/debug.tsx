import { useState } from 'react';
import {
	Box,
	Button,
} from '@mui/material';

interface Props {
	obj: any;
}

export
function Debug(props: Props) {
	const[hidden, setHidden] = useState(true);

	return (
		<Box>
			<Button onClick={() => setHidden(!hidden)}>
				Debug
			</Button>
			{!hidden && (
				<pre>
					{JSON.stringify(props.obj, null, 4)}
				</pre>
			)}
		</Box>
	);
}
