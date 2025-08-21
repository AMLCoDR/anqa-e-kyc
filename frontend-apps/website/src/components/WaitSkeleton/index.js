import React from 'react';

import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/core/Skeleton';


export const WaitSkeleton = () => {


	return (
		<Box sx={{ mt: 20, p: 4 }}>
			<Skeleton height="5rem" />
			<Skeleton variant="rectangular" height="20rem" />
			<Skeleton height="5rem" />
		</Box>
	);
};