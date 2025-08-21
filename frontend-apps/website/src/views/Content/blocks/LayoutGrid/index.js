import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MobileStepper from '@material-ui/core/MobileStepper';
import Stack from '@material-ui/core/Stack';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import Carousel from 'react-material-ui-carousel';

import { Factory } from '../Factory';
import { BlockPropTypes } from '../shared';


export const LayoutGrid = ({ content }) => {
	const [activeStep, setActiveStep] = useState(0);
	const maxSteps = content.fields.blocks.length;
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};


	return (
		<Box sx={{ pt: 1 }} >
			{/* desktop standard grid */}
			<Hidden mdDown>
				<Grid container spacing={2} justifyContent='flex-start' data-test="cardGrid-blocks">
					{content.fields.blocks.map((item, index) =>
						<Grid sx={{ maxWidth: 50 }} key={index} item md={4}>
							<Factory content={item} />
						</Grid>
					)}
				</Grid>
			</Hidden>
			{/* mobile carousel */}
			<Hidden mdUp>
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton size="large" color="primary" onClick={handleBack} disabled={activeStep === 0} >
							<KeyboardArrowLeft />
						</IconButton>
						<Stack sx={{ mx: { xs: 0.5, sm: 2 } }} direction="column" justifyContent="center" alignItems="center" spacing={1} >
							<Factory content={content.fields.blocks[activeStep]} />
							<MobileStepper
								steps={maxSteps}
								position="static"
								activeStep={activeStep}
							/>
						</Stack>
						<IconButton size="large" color="primary" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
							<KeyboardArrowRight />
						</IconButton>
					</Box>
				</Grid>
			</Hidden>
		</Box>
	);
}

LayoutGrid.propTypes = BlockPropTypes;
LayoutGrid.defaultProps = {};
