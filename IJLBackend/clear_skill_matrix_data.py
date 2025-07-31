#!/usr/bin/env python
"""
Clear all dummy/test data from skill matrix for fresh testing
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HitachiDojoMain.settings')
django.setup()

from app1.models import Score, OperatorLevel, OperationList, SkillMatrix

def clear_all_skill_matrix_data():
    """Clear all skill matrix related data"""
    
    print("🧹 CLEARING ALL SKILL MATRIX DATA")
    print("="*50)
    
    # 1. Clear all test scores
    scores_count = Score.objects.count()
    if scores_count > 0:
        Score.objects.all().delete()
        print(f"✅ Deleted {scores_count} test scores")
    else:
        print("ℹ️  No test scores to delete")
    
    # 2. Clear all operator levels (skill matrix entries)
    operator_levels_count = OperatorLevel.objects.count()
    if operator_levels_count > 0:
        OperatorLevel.objects.all().delete()
        print(f"✅ Deleted {operator_levels_count} operator skill levels")
    else:
        print("ℹ️  No operator skill levels to delete")
    
    # 3. Clear all operations (but keep the skill matrices)
    operations_count = OperationList.objects.count()
    if operations_count > 0:
        OperationList.objects.all().delete()
        print(f"✅ Deleted {operations_count} operations")
    else:
        print("ℹ️  No operations to delete")
    
    # 4. Show remaining skill matrices (these are the department containers)
    skill_matrices = SkillMatrix.objects.all()
    print(f"ℹ️  Kept {skill_matrices.count()} skill matrix departments:")
    for matrix in skill_matrices:
        print(f"   📋 {matrix.department}")
    
    print("\n🎉 SKILL MATRIX DATA CLEARED!")
    print("="*50)

def verify_clean_state():
    """Verify that the skill matrix is in a clean state"""
    
    print("\n🔍 VERIFYING CLEAN STATE")
    print("="*50)
    
    scores = Score.objects.count()
    operator_levels = OperatorLevel.objects.count()
    operations = OperationList.objects.count()
    skill_matrices = SkillMatrix.objects.count()
    
    print(f"📊 Test Scores: {scores}")
    print(f"👥 Operator Skill Levels: {operator_levels}")
    print(f"🔧 Operations: {operations}")
    print(f"📋 Skill Matrix Departments: {skill_matrices}")
    
    if scores == 0 and operator_levels == 0 and operations == 0:
        print("\n✅ CLEAN STATE CONFIRMED!")
        print("The skill matrix is now empty and ready for fresh testing.")
    else:
        print("\n⚠️  Some data still remains. You may need to clear manually.")

def show_testing_instructions():
    """Show instructions for testing with clean data"""
    
    print("\n🧪 TESTING INSTRUCTIONS")
    print("="*50)
    print("Now you can test the skill matrix properly:")
    print("")
    print("1. 📋 Check Frontend:")
    print("   - Go to: http://localhost:5173/skillmatrix")
    print("   - Should show empty tables (no employees)")
    print("   - Only department headers should be visible")
    print("")
    print("2. 🎯 Test Automatic Updates:")
    print("   - Go to any Level Training (Level 1, 2, or 3)")
    print("   - Click on a topic (e.g., 'Push on Fix')")
    print("   - Navigate to Evaluation Test")
    print("   - Assign an employee and complete the test")
    print("   - Pass with ≥80% score")
    print("")
    print("3. ✅ Verify Results:")
    print("   - Go back to skill matrix")
    print("   - Employee should now appear in the table")
    print("   - Skill level should show with pie chart")
    print("   - Should be in correct department")
    print("")
    print("4. 🔄 Test Multiple Employees:")
    print("   - Repeat with different employees")
    print("   - Try different skills and levels")
    print("   - Verify each appears in skill matrix")

def show_manual_clearing_instructions():
    """Show how to clear data manually if needed"""
    
    print("\n🛠️  MANUAL CLEARING (if needed)")
    print("="*50)
    print("If you need to clear data manually:")
    print("")
    print("1. 🗄️  Django Admin:")
    print("   - Go to: http://127.0.0.1:8000/admin/")
    print("   - Login with admin credentials")
    print("   - Delete entries from:")
    print("     • Scores")
    print("     • Operator Levels")
    print("     • Operation Lists")
    print("")
    print("2. 💻 Database Commands:")
    print("   python manage.py shell")
    print("   >>> from app1.models import Score, OperatorLevel, OperationList")
    print("   >>> Score.objects.all().delete()")
    print("   >>> OperatorLevel.objects.all().delete()")
    print("   >>> OperationList.objects.all().delete()")
    print("")
    print("3. 🔄 Re-run this script:")
    print("   python clear_skill_matrix_data.py")

if __name__ == '__main__':
    # Clear all data
    clear_all_skill_matrix_data()
    
    # Verify clean state
    verify_clean_state()
    
    # Show testing instructions
    show_testing_instructions()
    
    # Show manual clearing instructions
    show_manual_clearing_instructions()
    
    print("\n🎉 READY FOR FRESH TESTING!")
    print("The skill matrix is now completely clean and ready for you to test the automatic updates.")
