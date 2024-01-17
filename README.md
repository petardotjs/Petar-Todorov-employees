# Petar-Todorov-employees

Some side notes:

- Since I needed to handle various date formats and it was uncertain whether
  dates like "10/11/2023" followed the "dd/MM/yyyy" or "MM/dd/yyyy" format, I
  decided to let the user specify the date format through a select menu. This
  approach ensures that the dates are parsed correctly.

- Initially, I considered implementing my own CSV parser. However, due to my
  limited experience with this file format and uncertainty about handling all
  edge cases, I opted to use the papaparse library. Given its over 2 million
  downloads and some level of maintenance (though not actively), it is more
  likely to effectively handle these cases.
