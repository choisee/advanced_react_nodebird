import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { List, Button, Card } from 'antd';


const FollowList = ({header, data}) => {

    const styleGrid = useMemo(() => ({ gutter: 4, xs: 2, md: 3 }),[]);
    const styleList = useMemo(() => ({ marginBottom: 20 }),[]);
    const styleListItem = useMemo(() => ({ marginTop: 20 }),[]);
    const styleListDiv = useMemo(() => ({ textAlign: 'center', margin: '10px 0' }),[]);

    return <List grid={styleGrid}
                 style={styleList}
                 size="small"
                 header={<div>{header}</div>}
                 loadMore={
                 <div style={styleListDiv}>
                     <Button>더 보기</Button>
                 </div>}
                 bordered
                 dataSource={data}
                 renderItem={(item) => (
                     <List.Item style={styleListItem}>
                         <Card actions={[<StopOutlined key="stop" />]}>
                             <Card.Meta description={item.nickname} />
                         </Card>
                     </List.Item>
                 )}
    >
    </List>;
}


FollowList.propTypes = {
    header: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
};


export default FollowList;