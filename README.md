# RoomEcho

Reverberation time (RT60) estimator for a rectangular room, with the acoustic panel area needed to reach a target.

- Sabine: RT60 = 0.161 x V / A, A = sum(area x absorption coefficient)
- Eyring: RT60 = 0.161 x V / (-S x ln(1 - A/S))
- Panels needed = (0.161 V / target - A) / (panel coeff - replaced surface coeff)
- Classroom targets from ANSI/ASA S12.60: 0.6 s up to 283 m3, 0.7 s for 283 to 566 m3

Absorption coefficients are typical mid-frequency (about 500 Hz) values, approximate. Static client-side. `node test-engine.js` runs the tests.

Sources: https://www.montana.edu/rmaher/eele217_fl19/lectures/lecture_12a.html , https://acousticalsociety.org/wp-content/uploads/2022/01/Classroom_Acoustics_for_Architects_4_18_15.pdf
