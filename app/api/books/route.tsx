export async function GET(request: Request) {
    const books = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
        { id: 3, title: '1984', author: 'George Orwell' },
    ];
    return new Response(JSON.stringify(books), {
        headers: { 'Content-Type': 'application/json' },
        
    });
}