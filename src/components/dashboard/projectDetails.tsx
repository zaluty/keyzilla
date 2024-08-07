"use client"
import {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { EllipsisVertical, Loader } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type Props = {
    repo: string
}

export default function ProjectDetails({ repo }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [apiKeyName, setApiKeyName] = useState<string>("")
    const [apiKeyValue, setApiKeyValue] = useState<string>("")
    const cache = useRef<{ [key: string]: string }>({}) // Cache to store env content
    const [apiKeys, setApiKeys] = useState<any[]>([])

    useEffect(() => {
        fetchApiKey()
    }, [])

    const fetchApiKey = async () => {
        try {
            const response = await axios.post('/api/projectDetail', {
                projectName: repo
            })
            setApiKeys(response.data)
        } catch (error) {
            console.error('Error fetching API keys:', error)
        }
    }

    const handleAddApiKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault
        try {
            setIsLoading(true)
            const response = await axios.post('/api/addApiKey', {
                name: apiKeyName,
                key: apiKeyValue,
                repo: repo
            })
            console.log('API Key added:', response.data)
            setIsLoading(false)
            fetchApiKey() // Refresh the API keys after adding a new one
        } catch (error) {
            console.error('Error adding API key:', error)
            setIsLoading(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button className="m-4" size="icon" ><EllipsisVertical /></Button>
            </SheetTrigger>
            <SheetContent className="p-4 bg-white dark:bg-black rounded-lg shadow-lg">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-xl font-bold">Environment File Content</SheetTitle>
                    <SheetDescription className="text-gray-600">
                        Below is the content of the .env file from the repository.
                    </SheetDescription>
                    {apiKeys.length > 0 ? (
                        <div className="block p-2 my-6 space-y-4 rounded overflow-auto">
                            <div>
                                {apiKeys.map((key) => (
                                    <div key={key.id}>
                                        <p>Name: {key.name}</p>
                                        <p>Key: {key.key}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={handleAddApiKey}>

                                <Label>API Key Name</Label>
                                <Input value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} />

                                <Label>API Key Value</Label>
                                <Input value={apiKeyValue} onChange={(e) => setApiKeyValue(e.target.value)} />

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader className="animate-spin" /> : 'Add API Key'}
                                </Button>
                            </form>
                        </div>
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}