import React from "react";
import Link from "next/link";
import PropsTypes from "prop-types";

const PostCardContent = ({ postData }) => {
	return (
		<div>
			{postData.split(/(#[^\s#]+)/g).map((v, i) => {
				if (v.match(/(#[^\s#]+)/)) {
					return (
						<Link href={`/hashtag/${v.slice(1)}`} key={i}>
							<a>{v}</a>
						</Link>
					);
				}
				return v;
			})}
		</div>
	);
};

PostCardContent.propTypes = {
	postData: PropsTypes.string.isRequired,
};

export default PostCardContent;
