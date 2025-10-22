import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const type = searchParams.get("type") || "all";

		// Fetch resources from Cloudinary
		const options: any = {
			type: "upload",
			max_results: 500,
			resource_type: type === "all" ? "image" : type,
		};

		let allResources: any[] = [];

		if (type === "all") {
			// Fetch both images and videos
			const [images, videos] = await Promise.all([
				cloudinary.api.resources({ ...options, resource_type: "image" }),
				cloudinary.api.resources({ ...options, resource_type: "video" }),
			]);

			allResources = [...images.resources, ...videos.resources];
		} else {
			const result = await cloudinary.api.resources(options);
			allResources = result.resources;
		}

		// Sort by created_at descending (newest first)
		allResources.sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);

		return NextResponse.json({ resources: allResources });
	} catch (error) {
		console.error("Error fetching Cloudinary media:", error);
		return NextResponse.json(
			{ error: "Failed to fetch media from Cloudinary" },
			{ status: 500 }
		);
	}
}

// Check if an image already exists
export async function POST(request: NextRequest) {
	try {
		const { publicId } = await request.json();

		if (!publicId) {
			return NextResponse.json(
				{ error: "Public ID is required" },
				{ status: 400 }
			);
		}

		// Try to get the resource
		const resource = await cloudinary.api.resource(publicId);

		return NextResponse.json({ exists: true, resource });
	} catch (error: any) {
		if (error.error?.http_code === 404) {
			return NextResponse.json({ exists: false });
		}
		console.error("Error checking Cloudinary resource:", error);
		return NextResponse.json(
			{ error: "Failed to check resource" },
			{ status: 500 }
		);
	}
}

// Delete a media resource
export async function DELETE(request: NextRequest) {
	try {
		const { publicId, resourceType } = await request.json();

		if (!publicId) {
			return NextResponse.json(
				{ error: "Public ID is required" },
				{ status: 400 }
			);
		}

		// Delete the resource from Cloudinary
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType || "image",
			invalidate: true,
		});

		if (result.result === "ok" || result.result === "not found") {
			return NextResponse.json({
				success: true,
				message: "Media deleted successfully",
				result,
			});
		} else {
			return NextResponse.json(
				{ error: "Failed to delete media", result },
				{ status: 400 }
			);
		}
	} catch (error: any) {
		console.error("Error deleting Cloudinary resource:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to delete media" },
			{ status: 500 }
		);
	}
}
