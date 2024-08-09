import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ErrorComponent = ({ title, description, onRetry }: { title: string, description: string, onRetry: () => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={onRetry}>
                    Retry
                </Button>
            </CardContent>
        </Card>
    );
};

export default ErrorComponent;