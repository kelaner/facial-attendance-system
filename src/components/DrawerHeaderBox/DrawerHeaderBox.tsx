import {Avatar, Badge, Link, Stack} from "@mui/material";
import {deepOrange} from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import React from 'react';

function DrawerHeaderBox() {

	return (
		<Stack direction={"row"}>
			<Link
				href={`${process.env.NEXT_PUBLIC_API_URL}/admin/`}
				target="_blank"
			>
				<IconButton>
					<StyledBadge
						overlap="circular"
						anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
						variant="dot"
					>
						<Avatar sx={{bgcolor: deepOrange[ 500 ], fontSize: 16}}>CMS</Avatar>
					</StyledBadge>
				</IconButton>
			</Link>
		</Stack>
	);
}

export default DrawerHeaderBox;


const StyledBadge = styled(Badge)(({theme}) => ( {
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""',
		},
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1,
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0,
		},
	},
} ));