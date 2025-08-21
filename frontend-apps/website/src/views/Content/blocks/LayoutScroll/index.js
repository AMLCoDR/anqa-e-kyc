import React, { useRef, createRef, useLayoutEffect } from 'react';

import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MobileStepper from '@material-ui/core/MobileStepper';
import Stack from '@material-ui/core/Stack';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/styles';

import { Factory } from '../Factory';
import { BlockPropTypes } from '../shared';

const useStyles = makeStyles(() => ({
	fade: {
		position: 'relative',
		'&:after': {
			content: '""',
			zIndex: 10,
			display: 'block',
			position: 'absolute',
			height: '100%',
			top: 0,
			left: 0,
			right: 0,
			background: 'rgba(255, 255, 255, 0.5)',
		}
	}
}));

export const LayoutScroll = ({ content, className }) => {
	const classes = useStyles();
	const blockCount = content.fields.blocks.length;
	let txtRefs = useRef([]);
	let imgRefs = useRef([]);
	const stickyRef = useRef();

	const [activeStep, setActiveStep] = React.useState(0);
	const maxSteps = content.fields.blocks.length;
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	if (txtRefs.current.length !== blockCount) {
		txtRefs = Array(blockCount).fill().map((_, i) => txtRefs[i] || createRef())
		imgRefs = Array(blockCount).fill().map((_, i) => imgRefs[i] || createRef())
	}

	useLayoutEffect(() => {
		const onScroll = () => {

			let set = false;
			for (let i = txtRefs.length - 1; i >= 0; i--) {
				if (txtRefs[i].current) {
					const txtTop = txtRefs[i].current.getBoundingClientRect().top;
					const imgBox = imgRefs[i].current.getBoundingClientRect();

					if (imgBox.top <= txtTop && !set) {// && txtTop < imgBox.bottom) {
						txtRefs[i].current.classList.remove(classes.fade);
						//stickyRef.current.style.top = `${50 + (i * -150)}px`;
						set = true;
					} else {
						txtRefs[i].current.classList.add(classes.fade)
					}
				}
			}
		};

		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, [classes.fade]);

	return (
		<Box sx={{ py: 4, className }} data-test="stickySection">

			{/* desktop standard grid */}
			<Hidden mdDown>
				<Grid container spacing={3} data-test="cardGrid-blocks">
					<Grid item sm={6}>
						<Box ref={stickyRef} sx={{ position: 'sticky', top: 50 }}>
							{content.fields.blocks.map((item, index) =>
								<Box key={index} ref={txtRefs[index]} >
									<Factory content={item} hideImage={true} />
								</Box>
							)}
						</Box>
					</Grid>
					<Grid item sm={6}>
						{content.fields.blocks.map((item, index) =>
							<Box key={index} ref={imgRefs[index]} sx={{ overflow: 'hidden', marginRight: 'calc(49% - 25vw)', py: 10 }}>
								{item.fields.image &&
									<CardMedia
										component="img"
										image={item.fields.image.fields.file.url}
										title={item.fields.image.fields.description ? `Image of ${item.fields.image.fields.description}` : ""}
										sx={{ maxWidth: 'calc(20em + 24vw)' }}
									/>
								}
							</Box>
						)}
					</Grid>
				</Grid>
			</Hidden>
			{/* mobile carousel */}
			<Hidden mdUp>
				<Grid container direction="column" justifyContent="center" alignItems="center">
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton size="large" color="primary" onClick={handleBack} disabled={activeStep === 0} >
							<KeyboardArrowLeft />
						</IconButton>
						<Stack sx={{ mx: { xs: 1, sm: 2, md: 4 } }} direction="column" justifyContent="center" alignItems="center" spacing={2} >
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

LayoutScroll.propTypes = BlockPropTypes;
LayoutScroll.defaultProps = {};

// function ScrollTop({ children, window }) {
//     const trigger = useScrollTrigger({
//         disableHysteresis: true,
//         threshold: 1200,
//     });

//     return (
//         <Slide in={trigger} direction="up" timeout={1000} mountOnEnter unmountOnExit>
//             {children}
//         </Slide>
//     );
// }