'use client';
import { Button } from "@/components/ui/button"
import {  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Star } from "lucide-react"  // Import the Star icon
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const Reviews = () => {
    const { user } = useUser();
    const router = useRouter();
    const reviews = useQuery(api.admin.getAllReviews)
    const approveReview = useMutation(api.admin.approveReview);
    const  disApproveReview = useMutation(api.admin.disApproveReview)

    const approved = async (id) => {
        approveReview({
            _id: id
        })
    }
    const disApproved = async (id) => {
        disApproveReview({
            _id: id
        })
    }

    // Helper function to render stars based on rating
    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 0; i < rating; i++) {
            stars.push(<Star key={i} className="text-primary inline" />)  // Display stars
        }
        return stars
    }

    const copy = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText('https://ifitness-smoky.vercel.app/addreview')
        .then(() => {
            toast.success('Copied to clipboard')
        })
        .catch(err => {
            toast.error('Failed to copy to clipboard')
        })
          }
    }

    if(user && user?.emailAddresses[0].emailAddress !== 'dikkorabiat25@gmail.com') {
        router.push('/');

        return null;
    }

    return (
        <div>
            <div className="flex justify-between items-center p-6">
                <h2 className="text-3xl font-bold ">Customer Reviews</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default">Add Reviews</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Share link</DialogTitle>
                            <DialogDescription>
                                Anyone who has this link will be able to view this.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">Link</Label>
                                <Input id="link" defaultValue="localhost:3000/addreview" readOnly />
                            </div>
                            <Button type="submit" size="sm" className="px-3" 
                            onClick={copy}
                            >
                                <span className="sr-only">Copy</span>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="p-7">
                <Table>
                    <TableCaption>A list of your recent reviews.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Rating</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews && reviews.map((review) => (
                            <TableRow key={review?._id}>
                                <TableCell className="font-medium">{review?.name}</TableCell>
                                <TableCell>{review?.email}</TableCell>
                                <TableCell>{review?.phone}</TableCell>
                                <TableCell className="text-right">
                                    {renderStars(review?.rating)}  {/* Display stars based on rating */}
                                </TableCell>
                                <TableCell className="text-right">
                                    {review?.approved === false ? (
                                        <Button onClick={() => approved(review?._id)}
                                        className='bg-green-400'
                                        >Approve</Button>
                                    ) : (
                                        <Button onClick={() => disApproved(review?._id)}>Disapprove</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Reviews;
