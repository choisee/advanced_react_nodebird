import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import { Overlay, Header, CloseBtn, SlickWrapper, ImgWrapper, Indicator, Global } from "./styles";
import {backUrl} from "../../config/config";

const ImagesZoom = ({ images, onClose }) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	return (
		<Overlay>
			<Global />
			<Header>
				<h1>상세 이미지</h1>
				<CloseBtn onClick={onClose}>X</CloseBtn>
			</Header>
			<SlickWrapper>
				<div>
					<Slick
						initialSlide={0}
						beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)}
						infinite
						arrows={false}
						slidesToShow={1}
						slidesToScroll={1}>
						{images.map((v) => (
							<ImgWrapper key={v.src}>
								<img src={`${backUrl}/${v.src}`} alt={v.src} />
							</ImgWrapper>
						))}
					</Slick>
					<Indicator>
						<div>
							{currentSlide + 1} / {images.length}
						</div>
					</Indicator>
				</div>
			</SlickWrapper>
		</Overlay>
	);
};

ImagesZoom.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object).isRequired,
	// images: PropTypes.arrayOf(PropTypes.shape({
	//     src: PropTypes.string,
	// })).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;

// 함수는 PropTypes.func.isRequired
// javascript 에서 함수 호출 방법 2가지 : func() , func``

// 스타일 관련 파일 분리를 위해 index.js, styles.js 를 폴더로 만들고 하위에 스타일을 만듦
