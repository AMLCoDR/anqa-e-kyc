import React, { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
// import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
// import Paper from '@material-ui/core/Paper';
// import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import cloneDeep from 'lodash.clonedeep';
import ReactFlow, { Controls, isNode } from 'react-flow-renderer';
import { Link as RouterLink, useParams } from 'react-router-dom';
// import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls } from 'react-flow-renderer';

import { useEntity } from '../context';
import { Entity as pbEntity, Relationship } from '../../../proto/entity/v1/entity_pb';
import EntityNode from './EntityNode';

const entityInfo = (e) => {
    const organisation = e && e.getOrganisation();
    const person = e && e.getPerson();
    if (organisation) {
        return {
            name: organisation.getName(),
            type: 'ORGANISATION'
        };
    } else {
        return {
            name: `${person.getFirstName()} ${person.getLastName()}`,
            type: 'PERSON'
        };
    }
}

const nodeTypes = { entityNode: EntityNode };

export const EntityGraph = () => {
    const [elements, setElements] = useState({});
    // const [detail, setDetail] = useState();
    // const [anchorEl, setAnchorEl] = useState();
    const [flowInst, setFlowInst] = useState();
    const { id } = useParams();
    const { state, get, update, query } = useEntity();
    let flowRef = useRef();

    /* 1. get entity and its linked entities, 2. get all unlinked entities */
    useEffect(() => {
        id && get(id);
        query({});
    }, [get, query, id]);

    /* link an entity */
    const handleLink = (entity) => {
        const rp = new pbEntity();
        rp.setId(entity.getId());
        // copy new child entity details so can display without refetching
        if (entity.getOrganisation()) {
            rp.setOrganisation(entity.getOrganisation());
        } else {
            rp.setPerson(entity.getPerson());
        }
        // create relationship with root (customer) entity
        const r = new Relationship();
        r.setPredicate(0);
        r.setEntity(rp);
        // save relationship — link
        const e = cloneDeep(state.entity);
        e.getRelatedPartiesList().push(r);
        update(e);
    };

    /* unlink an entity */
    const handleUnlink = useCallback((id) => {
        // remove from flow elements
        setElements(prev => {
            delete prev[id];
            return { ...prev };
        });

        // remove relationship and save 
        const e = cloneDeep(state.entity);
        const index = e.getRelatedPartiesList().findIndex(rp => rp.getEntity().getId() === id);
        e.getRelatedPartiesList().splice(index, 1);
        update(e);
    }, [state.entity, update]);

    /* load elements */
    useEffect(() => {
        if (!state.entity) {
            return;
        }
        const nodes = loadNodes(state.entity, flowRef.current.clientWidth - 240, handleUnlink);
        setElements(nodes);
    }, [state.entity, handleUnlink]);

    /* resize layout after window resize */
    useEffect(() => {
        const resize = debounce(() => {
            const nodes = loadNodes(state.entity, flowRef.current.clientWidth - 240, handleUnlink);
            setElements(nodes);
            //flowInst.fitView();
        }, 1000)

        window.addEventListener('resize', resize)
        return (() => {
            window.removeEventListener('resize', resize)
        });
    });

    /* resize layout to fit all nodes */
    const handleLoad = useCallback((rfi) => {
        if (!flowInst) {
            //rfi.setTransform({ x: 0, y: 0, zoom: 1.0 });
            //rfi.fitView();
            setFlowInst(rfi);
        }
    }, [flowInst]);

    const handleNodeClick = (event, element) => {
        if (!isNode(element)) {
            return;
        }
        // setAnchorEl(event.target);
        // setDetail("hello");
    }

    const handleDrawerClose = () => {
        // setOpen(false);
    };

    return (
        <Box sx={{ width: "100%" }} >
            <Breadcrumbs>
                <Link component={RouterLink} to="/customers">Entities</Link>
                <Typography color="textPrimary" variant="body2">Link</Typography>
            </Breadcrumbs>
            <Box sx={{ width: 'calc(100% - 240px)', py: "20px", display: "flex", justifyContent: "space-between" }} >
                {state.entity &&
                    <Typography variant="h2" color="secondary" data-test="entity-name">
                        {entityInfo(state.entity).name}
                    </Typography>
                }
                <Button variant="contained"
                    component={RouterLink} to="/customers"
                    startIcon={<CancelIcon fontSize="small" />}
                    data-test="close-button"
                >
                    Close
                </Button>
            </Box>
            <Box ref={flowRef} sx={{ height: 400, width: "100%" }}  >
                {elements &&
                    <ReactFlow
                        elements={Object.values(elements)}
                        onLoad={handleLoad}
                        onElementClick={handleNodeClick}
                        //onElementsRemove={onElementsRemove}
                        //onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        snapToGrid={true}
                        snapGrid={[20, 20]}
                        defaultZoom={1.0}
                        style={{ background: '#fff' }}
                        connectionLineStyle={{ stroke: '#fff' }}
                    >
                        <Controls />
                    </ReactFlow>
                }

                {/* {detail &&
                    <Popper id={id} open={detail} anchorEl={anchorEl} transition
                        placement="bottom"
                        disablePortal={false}
                        modifiers={{
                            flip: { enabled: true },
                            arrow: { enabled: true },
                            preventOverflow: {
                                enabled: true,
                                boundariesElement: 'scrollParent',
                            }
                        }}
                    >
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper style={{padding:'20px', zIndex:2000}}>
                                    {detail}
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                } */}
                <Drawer

                    variant="permanent"
                    sx={{
                        width: 30,
                        flexShrink: 0,
                    }}
                    anchor="right"
                // open={open}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: (0, 1),
                        // necessary for content to be below app bar
                        // ...theme.mixins.toolbar,
                        justifyContent: 'flex-start'
                    }}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List component="nav" aria-label="main mailbox folders">
                        {state.entities.map((e, index) => {
                            if (!elements[e.getId()]) {
                                return (
                                    <Box key={index}>
                                        <IconButton onClick={() => handleLink(e)}>
                                            <AddIcon size="small" />
                                            <Typography variant="body2">{`${entityInfo(e).name}`}</Typography>
                                        </IconButton>
                                    </Box>
                                );
                            }
                            return <React.Fragment key={index} />
                        })}
                    </List>
                </Drawer>
            </Box>
        </Box>
    );
}

export default EntityGraph;


/* -----------------
  Utility functions 
-----------------*/

const loadNodes = (entity, width, onRemove) => {
    const root = entity;
    const info = entityInfo(root);

    const nodes = {};
    nodes[root.getId()] = {
        id: root.getId(),
        type: 'entityNode',
        data: {
            label: info.name,
            type: info.type,
            value: "CUSTOMER",
        },
        position: { x: width / 2, y: 0 },
        style: {
            border: '0px solid #777', transation: '200ms ease-out', borderRadius: '4px', padding: 5
        },
    };

    const gapWidth = width / (entity.getRelatedPartiesList().length + 1)

    entity.getRelatedPartiesList().forEach((rp, index) => {
        const edge = rp.getEntity();
        // nodes
        const info = entityInfo(edge);
        nodes[edge.getId()] = {
            id: edge.getId(),
            type: 'entityNode',
            data: {
                label: info.name,
                type: info.type,
                value: rp.getPredicate(),
                onRemove: onRemove,
            },
            position: { x: gapWidth * index + gapWidth, y: 200 },
        };
        // edges/links
        nodes[`${root.getId()}-${edge.getId()}`] = {
            id: `${root.getId()}-${edge.getId()}`,
            source: root.getId(),
            target: edge.getId(),
            label: 'is key manager of',
            style: { stroke: '#000000' },
        };
    })

    return nodes;
}

function debounce(fn, ms) {
    let timer
    return (() => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    });
}