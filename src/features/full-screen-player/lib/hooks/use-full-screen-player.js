import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSong } from '../../../../contexts/song';
import { rightSide } from '../../../../shared/data/player-right-side';
import checkNumber from '../../../../shared/lib/check-number';
import useOutsideClick from '../../../../shared/lib/hooks/use-outside-click';
import useRenderCount from '../../../../shared/lib/hooks/use-render-count';

const useFullScreenPlayer = () => {
	const {
		imgColors,
		rightSideCurrentPage,
		setRightSideCurrentPage,
		setOpenFullScreenPlayer,
		lyrics,
		openMenu,
		setOpenMenu,
	} = useSong();

	const lyricsRef = useRef(null);
	const [transformTransition, setTransformTransition] = useState(0.05);
	const [mobileMenuTransition, setMobileMenuTransition] = useState(0);
	// const [swipeDown, setSwipeDown] = useState(false)
	const [deltaY, setDeltaY] = useState(0);
	const [deltaYMobileMenu, setDeltaYMobileMenu] = useState(0);
	const mobileContentScroll = useRef();
	// setup ref for your usage
	const mobileMenuRef = React.useRef();
	useOutsideClick(mobileMenuRef, setOpenMenu);

	const handlers = useSwipeable({
		// onSwiped: (eventData) => {setSwipeDown(eventData.dir === 'Down')},
		onSwiping: (event) => {
			if (event.deltaY > 0) setDeltaY(event.deltaY);
		},
	});

	// setup ref for your usage
	const bgRef = React.useRef();

	const handlersForMobileMenu = useSwipeable({
		onSwiping: (event) => {
			event.event.stopPropagation();
			if (
				openMenu &&
				mobileContentScroll.current.scrollTop === 0 &&
				event.deltaY > 0
			)
				setDeltaYMobileMenu(event.deltaY);
			else if (!openMenu && event.deltaY < 0) setDeltaYMobileMenu(event.deltaY);
		},
		onSwipedLeft: () => {
			setRightSideCurrentPage(checkNumber(rightSideCurrentPage + 1, 3));
		},
		onSwipedRight: () => {
			setRightSideCurrentPage(checkNumber(rightSideCurrentPage - 1, 3));
		},
	});

	function returnToInitialMobileMenu() {
		let dropDelta;
		clearTimeout(dropDelta);
		setMobileMenuTransition(0);
		dropDelta = setTimeout(() => {
			setMobileMenuTransition(0.2);
			setDeltaYMobileMenu(0);
		}, 300);
	}

	useEffect(() => {
		if (deltaY > 150) {
			setOpenFullScreenPlayer(false);
		}
	}, [deltaY]);

	useEffect(() => {
		if (!openMenu && deltaYMobileMenu < -100) {
			setOpenMenu(true);
			setDeltaYMobileMenu(0);
			setMobileMenuTransition(0.2);
		} else if (openMenu && deltaYMobileMenu > 150) {
			setOpenMenu(false);
			setDeltaYMobileMenu(0);
			setMobileMenuTransition(0.2);
		} else {
			returnToInitialMobileMenu();
		}
	}, [deltaYMobileMenu]);

	function returnToInitial() {
		let dropDelta;
		clearTimeout(dropDelta);
		setTransformTransition(0.2);
		dropDelta = setTimeout(() => {
			setDeltaY(0);
			setTransformTransition(0);
		}, 100);
	}

	const refPassthroughBg = (el) => {
		handlers.ref(el);
		bgRef.current = el;
	};

	const refPassthroughMobileMenu = (el) => {
		handlersForMobileMenu.ref(el);
		mobileMenuRef.current = el;
	};

	useEffect(() => {
		if (imgColors.length !== 0) {
			document.documentElement.style.setProperty("--themeColor", imgColors[1]);
			document.documentElement.style.setProperty("--themeColor2", imgColors[0]);
			document.documentElement.style.setProperty("--themeColor3", imgColors[2]);
			document.documentElement.style.setProperty("--themeColor4", imgColors[5]);
			document.documentElement.style.setProperty(
				"--themeColorTransparent",
				imgColors[0] + "6e"
			);
		}
	}, [imgColors]);

	function rightSideContent(currentPage) {
		let RightSidePage = rightSide[currentPage].component;
		return <RightSidePage />;
	}

	function noLyrics() {
		return lyrics && lyrics.length === 0;
	}

	function changeRightSidePage(el) {
		if (el.id === 2 && noLyrics()) return null;
		setMobileMenuTransition(0.2);
		setRightSideCurrentPage(el.id);
		setOpenMenu(true);
	}

	return {
		deltaY,
		transformTransition,
		refPassthroughBg,
		handlers,
		returnToInitial,
		setOpenFullScreenPlayer,
		openMenu,
		setOpenMenu,
		rightSideCurrentPage,
		noLyrics,
		changeRightSidePage,
		lyricsRef,
		rightSideContent,
		handlersForMobileMenu,
		refPassthroughMobileMenu,
		deltaYMobileMenu,
		mobileMenuTransition,
		mobileContentScroll,
	}
}

export default useFullScreenPlayer
