// 1. ייבוא של המודול השמור
import { createServer } from 'node:http';

let count = 0;

// 2. יצירת שרת
const server = createServer((req, res) => {
  
        count++;
        
     if (req.method === 'GET') {
         res.end(`count: ${count}`);
     }
       else {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        res.end(`ברוך הבא לאתר שלנו,הפעלת מתודה : ${req.method} לכתובת:${pathname}`);


       }

});

// 3. הרצת השרת על כתובת מסוימת
server.listen(5050, () => {
    console.log('running at http://localhost:5050');
});