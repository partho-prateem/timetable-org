import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PendingItem {
  id: string;
  owner: string;
  title: string;
  submittedAt: string;
}

const initial: PendingItem[] = [
  {
    id: "tt-001",
    owner: "2025-CSE-A",
    title: "Sem 5 Draft",
    submittedAt: "2025-09-01",
  },
  {
    id: "tt-002",
    owner: "2025-ECE-A",
    title: "Sem 5 Draft",
    submittedAt: "2025-09-02",
  },
];

export default function Admin() {
  const [items, setItems] = useState<PendingItem[]>(initial);

  const act = (id: string, action: "approve" | "reject") => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <AppLayout>
      <PageTitle
        title="Admin"
        description="Approve or reject submitted timetables"
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-48" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>{it.id}</TableCell>
                  <TableCell>{it.owner}</TableCell>
                  <TableCell>{it.title}</TableCell>
                  <TableCell>{it.submittedAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => act(it.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => act(it.id, "approve")}>
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
