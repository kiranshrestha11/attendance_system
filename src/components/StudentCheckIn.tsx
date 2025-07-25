import React, { useState } from 'react';
import { Clock, User, CheckCircle, LogOut, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Student, AttendanceRecord } from '../types';

export const StudentCheckIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const findStudent = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, let's try an exact match with eq (case-insensitive)
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
        
        console.log('✅ Student data:', studentData);
        console.log('❌ Error:', studentError);
        console.log('Student fetch result:', { studentData, studentError });


      if (studentError) {
        console.log('Error details:', studentError);
        setError(`Database error: ${studentError.message}`);
        setStudent(null);
        return;
      }

      if (!studentData) {
        setError('Student not found. Please check your email or contact your teacher.');
        setStudent(null);
        return;
      }

      setStudent(studentData);

      // Check if student already has a record for today
      const today = new Date().toISOString().split('T')[0];
      const { data: recordData } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', studentData.id)
        .eq('date', today)
        .maybeSingle();

      setCurrentRecord(recordData);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An error occurred while finding student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!student) return;

    setIsLoading(true);
    setError('');

    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          student_id: student.id,
          check_in_time: now,
          date: today,
        })
        .select()
        .single();

      if (error) {
        setError('Failed to check in. Please try again.');
      } else {
        setCurrentRecord(data);
      }
    } catch (err) {
      setError('An error occurred during check-in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentRecord) return;

    setIsLoading(true);
    setError('');

    try {
      const now = new Date().toISOString();
      const checkInTime = new Date(currentRecord.check_in_time);
      const checkOutTime = new Date(now);
      const durationMinutes = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));

      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          check_out_time: now,
          duration_minutes: durationMinutes,
        })
        .eq('id', currentRecord.id)
        .select()
        .single();

      if (error) {
        setError('Failed to check out. Please try again.');
      } else {
        setCurrentRecord(data);
      }
    } catch (err) {
      setError('An error occurred during check-out');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setStudent(null);
    setCurrentRecord(null);
    setError('');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Student Check-In</h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: true 
            })}
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          {!student ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Student Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                  onKeyPress={(e) => e.key === 'Enter' && findStudent()}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                onClick={findStudent}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                {isLoading ? 'Finding...' : 'Find Student'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.student_id}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>

              {currentRecord ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Check-in Time</span>
                      <span className="text-sm text-gray-900">{formatTime(currentRecord.check_in_time)}</span>
                    </div>
                    
                    {currentRecord.check_out_time ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Check-out Time</span>
                          <span className="text-sm text-gray-900">{formatTime(currentRecord.check_out_time)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Duration</span>
                          <span className="text-sm font-bold text-green-600">
                            {formatDuration(currentRecord.duration_minutes || 0)}
                          </span>
                        </div>
                        <div className="mt-4 text-center">
                          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Session Complete
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-4">
                        <div className="text-center mb-4">
                          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Clock className="h-4 w-4 mr-2" />
                            Checked In
                          </div>
                        </div>
                        <button
                          onClick={handleCheckOut}
                          disabled={isLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {isLoading ? 'Checking out...' : 'Check Out'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {isLoading ? 'Checking in...' : 'Check In'}
                </button>
              )}

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                onClick={resetForm}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Switch Student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};