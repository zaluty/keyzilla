'use client';
import React, { useState, useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    NodeTypes,
    NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { AddProjectDialog } from '@/components/dashboard/new-project';

// Custom node component
const ProjectNode: React.FC<NodeProps> = ({ data }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold">{data.label}</h3>
        <p>Status: {data.status}</p>
    </div>
);

const nodeTypes: NodeTypes = {
    project: ProjectNode,
};

const initialNodes: Node[] = [

    { id: '2', type: 'project', position: { x: 500, y: 300 }, data: { label: 'Project 2', status: 'Stopped', API: 'API' } },
];

const initialEdges: Edge[] = [];

type Project = {
    id: string;
    name: string;
    status: string;
    API: string;
}

export default function Dashboard() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(({ params }: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const addNewProject = (project: Project) => {
        const newNode: Node = {
            id: project.id,
            type: 'project',
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: project.name, status: project.status, API: project.API },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Controls />
                <Background />
            </ReactFlow>
            <div className="absolute top-4 left-4">
                <AddProjectDialog onAddProject={addNewProject} />
            </div>
        </div>
    );
}