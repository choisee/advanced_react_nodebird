import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom/index";

const PostImages = ({ images }) => {
	const [showImagesZoom, setShowImagesZoom] = useState(false);

	const onZoom = useCallback(() => {
		setShowImagesZoom(true);
	}, []);
	const onClose = useCallback(() => {
		setShowImagesZoom(false);
	}, []);


	if (images.length === 1) {
		return (
			<>
				<img role="presentation" src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} />
				{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	if (images.length === 2) {
		return (
			<>
				<img
					role="presentation"
					style={{ width: "50%", display: "inline-block" }}
					src={`${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
				/>
				<img
					role="presentation"
					style={{ width: "50%", display: "inline-block" }}
					src={`${images[1].src}`}
					alt={images[1].src}
					onClick={onZoom}
				/>
				{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	return (
		<>
			<div>
				<img
					role="presentation"
					style={{ width: "50%" }}
					src={`${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
				/>
				<div
					role="presentation"
					style={{
						display: "inline-block",
						width: "50%",
						textAlign: "center",
						verticalAlign: "middle",
					}}
					onClick={onZoom}>
					<PlusOutlined />
					<br />
					{images.length - 1}
					개의 사진 더보기
				</div>
			</div>
			{showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
		</>
	);
};

PostImages.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;


// role="presentation" 접근성때문에 넣음, 굳이 onclick하지 않아도 되는 항목 (버튼 등이 아닌 항목)