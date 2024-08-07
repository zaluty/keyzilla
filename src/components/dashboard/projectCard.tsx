interface ProjectCardProps {
    name: string;
    url: string;
    description: string;
    lastUpdated: string;
}

export default function ProjectCard({ name, url, description, lastUpdated }: ProjectCardProps) {
    return (
        <div className="bg-muted p-4 rounded-md shadow-md">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-gray-400">{description}</p>
            <a href={url} className="text-blue-400 hover:underline">
                {url}
            </a>
            <p className="text-gray-500 text-sm mt-2">Last updated: {lastUpdated}</p>
        </div>
    );
}